from rest_framework import serializers

from planner.models import (
    BudgetLineItem,
    BudgetPlan,
    BudgetProfile,
    InterventionOption,
    LongevityGoal,
    UserProfile,
)


class UserProfileInputSerializer(serializers.Serializer):
    age = serializers.IntegerField(min_value=18, max_value=120)
    country = serializers.CharField(default="Germany")
    region = serializers.CharField()
    insurance_type = serializers.ChoiceField(choices=UserProfile.InsuranceType.choices)
    risk_preference = serializers.CharField(default="balanced")
    monthly_income = serializers.DecimalField(max_digits=12, decimal_places=2)
    fixed_costs = serializers.DecimalField(max_digits=12, decimal_places=2)
    discretionary_budget = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )
    emergency_target = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )
    goals = serializers.ListField(child=serializers.CharField(), required=False)


class GeneratePlanSerializer(serializers.Serializer):
    scenario = serializers.ChoiceField(choices=BudgetPlan.Scenario.choices)


class InterventionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterventionOption
        fields = (
            "id",
            "name",
            "category",
            "monthly_cost",
            "quality_score",
            "purity_score",
            "bioavailability_score",
            "trust_score",
            "available_in_region",
            "insurance_hint",
        )


class BudgetLineItemSerializer(serializers.ModelSerializer):
    intervention = InterventionOptionSerializer(read_only=True)

    class Meta:
        model = BudgetLineItem
        fields = (
            "name",
            "category",
            "monthly_allocation",
            "rationale",
            "intervention",
        )


class BudgetPlanSerializer(serializers.ModelSerializer):
    line_items = BudgetLineItemSerializer(many=True)

    class Meta:
        model = BudgetPlan
        fields = (
            "id",
            "scenario",
            "monthly_longevity_budget",
            "summary",
            "line_items",
            "created_at",
        )


def upsert_user_with_budget(validated_data):
    goals = validated_data.pop("goals", [])
    budget_fields = {
        "monthly_income": validated_data.pop("monthly_income"),
        "fixed_costs": validated_data.pop("fixed_costs"),
        "discretionary_budget": validated_data.pop("discretionary_budget"),
        "emergency_target": validated_data.pop("emergency_target"),
    }
    user, _ = UserProfile.objects.update_or_create(
        email=validated_data["email"],
        defaults=validated_data,
    )
    BudgetProfile.objects.update_or_create(user=user, defaults=budget_fields)
    if goals:
        user.goals.all().delete()
        LongevityGoal.objects.bulk_create(
            [LongevityGoal(user=user, category=goal, priority=3) for goal in goals]
        )
    return user
