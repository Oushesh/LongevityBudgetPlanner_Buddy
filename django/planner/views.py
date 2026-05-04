from django.shortcuts import get_object_or_404
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from planner.models import BudgetPlan, UserProfile
from planner.serializers import (
    BudgetPlanSerializer,
    GeneratePlanSerializer,
    UserProfileInputSerializer,
    upsert_user_with_budget,
)
from planner.services import generate_plan


class PlannerInputView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = UserProfileInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data.copy()
        data["email"] = request.user.email
        user = upsert_user_with_budget(data)
        return Response(
            {
                "message": "Planner inputs saved",
                "email": user.email,
                "insurance_type": user.insurance_type,
            },
            status=status.HTTP_201_CREATED,
        )


class PlannerGenerateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = GeneratePlanSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(UserProfile, email=request.user.email)
        plan = generate_plan(user=user, scenario=serializer.validated_data["scenario"])
        return Response(BudgetPlanSerializer(plan).data, status=status.HTTP_201_CREATED)


class PlannerDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, plan_id):
        plan = get_object_or_404(BudgetPlan, id=plan_id, user__email=request.user.email)
        return Response(BudgetPlanSerializer(plan).data)


class PlannerRecalculateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, plan_id):
        prior_plan = get_object_or_404(
            BudgetPlan,
            id=plan_id,
            user__email=request.user.email,
        )
        plan = generate_plan(user=prior_plan.user, scenario=prior_plan.scenario)
        return Response(BudgetPlanSerializer(plan).data, status=status.HTTP_201_CREATED)
