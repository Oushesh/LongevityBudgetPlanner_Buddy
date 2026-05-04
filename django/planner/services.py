from decimal import Decimal

from django.db import transaction

from planner.models import BudgetLineItem, BudgetPlan, InterventionOption, UserProfile


SCENARIO_BUDGET_MULTIPLIER = {
    BudgetPlan.Scenario.CONSERVATIVE: Decimal("0.60"),
    BudgetPlan.Scenario.BALANCED: Decimal("0.80"),
    BudgetPlan.Scenario.AGGRESSIVE: Decimal("1.00"),
}


def score_option(option: InterventionOption) -> Decimal:
    # Prefer trustworthy and high-quality interventions at lower monthly cost.
    effectiveness = (option.quality_score * Decimal("0.6")) + (
        option.trust_score * Decimal("0.4")
    )
    return effectiveness / max(option.monthly_cost, Decimal("1"))


def compute_disposable_budget(user: UserProfile) -> Decimal:
    budget = user.budget
    disposable = budget.monthly_income - budget.fixed_costs
    if disposable < 0:
        return Decimal("0")
    if budget.discretionary_budget > 0:
        return min(disposable, budget.discretionary_budget)
    return disposable


@transaction.atomic
def generate_plan(user: UserProfile, scenario: str) -> BudgetPlan:
    disposable_budget = compute_disposable_budget(user)
    longevity_budget = disposable_budget * SCENARIO_BUDGET_MULTIPLIER[scenario]
    longevity_budget = longevity_budget.quantize(Decimal("0.01"))

    plan = BudgetPlan.objects.create(
        user=user,
        scenario=scenario,
        monthly_longevity_budget=longevity_budget,
        summary=(
            f"{scenario.capitalize()} plan for {user.insurance_type} user in "
            f"{user.region} with {longevity_budget} EUR allocated monthly."
        ),
    )

    options = InterventionOption.objects.filter(
        available_in_region__icontains=user.country
    ).order_by("-quality_score", "-trust_score")

    selected = sorted(options, key=score_option, reverse=True)
    remaining = longevity_budget
    for option in selected:
        if remaining <= 0:
            break
        if option.insurance_hint and option.insurance_hint != user.insurance_type:
            continue
        allocation = min(option.monthly_cost, remaining).quantize(Decimal("0.01"))
        BudgetLineItem.objects.create(
            plan=plan,
            intervention=option,
            name=option.name,
            category=option.category,
            monthly_allocation=allocation,
            rationale=(
                f"Selected for quality ({option.quality_score}) and trust "
                f"({option.trust_score}) relative to cost."
            ),
        )
        remaining -= allocation

    return plan
