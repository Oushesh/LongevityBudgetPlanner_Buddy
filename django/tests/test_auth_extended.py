import re

from django.core import mail
from django.core.cache import cache
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from users.throttles import LoginRateThrottle


class PasswordResetApiTests(APITestCase):
    def setUp(self):
        super().setUp()
        cache.clear()

    @override_settings(
        EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
        DEFAULT_FROM_EMAIL="test@example.com",
    )
    def test_password_reset_request_and_confirm(self):
        self.client.post(
            reverse("auth-register"),
            data={
                "username": "resetuser",
                "email": "reset@example.com",
                "password": "oldpass12",
            },
            format="json",
        )

        reset_resp = self.client.post(
            reverse("auth-password-reset"),
            data={"email": "reset@example.com"},
            format="json",
        )
        self.assertEqual(reset_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)
        body = mail.outbox[0].body
        uid_match = re.search(r"\(uid\):\s*(\S+)", body)
        token_match = re.search(r"reset token:\s*(\S+)", body, flags=re.IGNORECASE)
        self.assertIsNotNone(uid_match)
        self.assertIsNotNone(token_match)

        confirm_resp = self.client.post(
            reverse("auth-password-reset-confirm"),
            data={
                "uid": uid_match.group(1),
                "token": token_match.group(1),
                "new_password": "newpass12345",
            },
            format="json",
        )
        self.assertEqual(confirm_resp.status_code, status.HTTP_200_OK)

        login_resp = self.client.post(
            reverse("auth-login"),
            data={"username": "resetuser", "password": "newpass12345"},
            format="json",
        )
        self.assertEqual(login_resp.status_code, status.HTTP_200_OK)

    def test_password_reset_unknown_email_still_succeeds_message(self):
        resp = self.client.post(
            reverse("auth-password-reset"),
            data={"email": "nobody@example.com"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)


class LogoutBlacklistTests(APITestCase):
    def setUp(self):
        super().setUp()
        cache.clear()

    def test_logout_blacklists_refresh_token(self):
        self.client.post(
            reverse("auth-register"),
            data={
                "username": "logme",
                "email": "log@example.com",
                "password": "secret12345",
            },
            format="json",
        )
        login_resp = self.client.post(
            reverse("auth-login"),
            data={"username": "logme", "password": "secret12345"},
            format="json",
        )
        self.assertEqual(login_resp.status_code, status.HTTP_200_OK)
        refresh = login_resp.data["refresh"]

        logout_resp = self.client.post(
            reverse("auth-logout"),
            data={"refresh": refresh},
            format="json",
        )
        self.assertEqual(logout_resp.status_code, status.HTTP_200_OK)

        refresh_resp = self.client.post(
            reverse("auth-token-refresh"),
            data={"refresh": refresh},
            format="json",
        )
        self.assertEqual(refresh_resp.status_code, status.HTTP_401_UNAUTHORIZED)


class LoginThrottleTests(TestCase):
    def test_login_rate_limited_after_burst(self):
        cache.clear()
        LoginRateThrottle.rate = "2/minute"
        try:
            client = APIClient()
            url = reverse("auth-login")
            for _ in range(2):
                r = client.post(
                    url,
                    data={"username": "nope", "password": "wrong"},
                    format="json",
                )
                self.assertIn(
                    r.status_code,
                    (status.HTTP_401_UNAUTHORIZED, status.HTTP_400_BAD_REQUEST),
                )
            blocked = client.post(
                url,
                data={"username": "nope", "password": "wrong"},
                format="json",
            )
            self.assertEqual(blocked.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
        finally:
            del LoginRateThrottle.rate
