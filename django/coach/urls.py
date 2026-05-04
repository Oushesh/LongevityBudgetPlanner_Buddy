from django.urls import path

from coach.views import CoachRecommendView

urlpatterns = [
    path("recommend", CoachRecommendView.as_view(), name="coach-recommend"),
]
