from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from users.serializers import PasswordResetConfirmSerializer, PasswordResetRequestSerializer

User = get_user_model()
token_generator = PasswordResetTokenGenerator()


class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].strip().lower()
        user = User.objects.filter(email__iexact=email).first()

        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = token_generator.make_token(user)
            lines = [
                "You requested a password reset for LongevityBudgetPlanner.",
                "",
                f"Your user id (uid): {uid}",
                f"Your reset token: {token}",
                "",
                'Confirm with POST /auth/password/reset/confirm with JSON:',
                '{"uid": "<uid>", "token": "<token>", "new_password": "<new_password>"}',
            ]
            base = settings.PASSWORD_RESET_FRONTEND_BASE_URL.strip()
            if base:
                lines.insert(
                    4,
                    f"Or open: {base.rstrip('/')}/?uid={uid}&token={token}",
                )
            send_mail(
                subject="Password reset",
                message="\n".join(lines),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True,
            )

        return Response(
            {
                "detail": (
                    "If an account exists for that email, "
                    "password reset instructions have been sent."
                )
            },
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uid = serializer.validated_data["uid"]
        token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]

        try:
            raw_uid = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=raw_uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response(
                {"detail": "Invalid uid or token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not token_generator.check_token(user, token):
            return Response(
                {"detail": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()
        return Response({"detail": "Password has been reset."}, status=status.HTTP_200_OK)
