from django.shortcuts import get_object_or_404
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from coach.serializers import CoachRecommendSerializer
from coach.services import build_grounded_recommendation
from planner.models import BudgetPlan


class CoachRecommendView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CoachRecommendSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        plan = get_object_or_404(
            BudgetPlan,
            id=serializer.validated_data["plan_id"],
            user__email=request.user.email,
        )
        recommendation = build_grounded_recommendation(
            plan=plan,
            user_prompt=serializer.validated_data["user_prompt"],
        )
        return Response(recommendation)
