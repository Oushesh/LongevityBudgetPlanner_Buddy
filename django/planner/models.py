from django.db import models


class UserProfile(models.Model):
    class InsuranceType(models.TextChoices):
        GKV = "GKV", "GKV"
        PKV = "PKV", "PKV"

    email = models.EmailField(unique=True)
    age = models.PositiveIntegerField()
    country = models.CharField(max_length=64, default="Germany")
    region = models.CharField(max_length=128)
    insurance_type = models.CharField(
        max_length=3,
        choices=InsuranceType.choices,
        default=InsuranceType.GKV,
    )
    risk_preference = models.CharField(max_length=32, default="balanced")
    created_at = models.DateTimeField(auto_now_add=True)


class BudgetProfile(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name="budget")
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2)
    fixed_costs = models.DecimalField(max_digits=12, decimal_places=2)
    discretionary_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    emergency_target = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    updated_at = models.DateTimeField(auto_now=True)


class LongevityGoal(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="goals")
    category = models.CharField(max_length=64)
    priority = models.PositiveSmallIntegerField(default=3)
    notes = models.TextField(blank=True)


class InterventionOption(models.Model):
    class Category(models.TextChoices):
        SUPPLEMENT = "supplement", "Supplement"
        PREVENTION = "prevention", "Prevention"
        DIAGNOSTIC = "diagnostic", "Diagnostic"
        FITNESS = "fitness", "Fitness"

    name = models.CharField(max_length=128)
    category = models.CharField(max_length=32, choices=Category.choices)
    monthly_cost = models.DecimalField(max_digits=10, decimal_places=2)
    quality_score = models.DecimalField(max_digits=4, decimal_places=2)
    trust_score = models.DecimalField(max_digits=4, decimal_places=2)
    available_in_region = models.CharField(max_length=128, blank=True, default="Germany")
    insurance_hint = models.CharField(max_length=3, blank=True, default="")


class BudgetPlan(models.Model):
    class Scenario(models.TextChoices):
        CONSERVATIVE = "conservative", "Conservative"
        BALANCED = "balanced", "Balanced"
        AGGRESSIVE = "aggressive", "Aggressive"

    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="plans")
    scenario = models.CharField(max_length=16, choices=Scenario.choices)
    monthly_longevity_budget = models.DecimalField(max_digits=10, decimal_places=2)
    summary = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class BudgetLineItem(models.Model):
    plan = models.ForeignKey(BudgetPlan, on_delete=models.CASCADE, related_name="line_items")
    intervention = models.ForeignKey(
        InterventionOption,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=128)
    category = models.CharField(max_length=32)
    monthly_allocation = models.DecimalField(max_digits=10, decimal_places=2)
    rationale = models.TextField()
