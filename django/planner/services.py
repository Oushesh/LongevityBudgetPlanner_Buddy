from decimal import Decimal

from django.db import transaction

from planner.models import BudgetLineItem, BudgetPlan, InterventionOption, UserProfile


SCENARIO_BUDGET_MULTIPLIER = {
    BudgetPlan.Scenario.CONSERVATIVE: Decimal("0.60"),
    BudgetPlan.Scenario.BALANCED: Decimal("0.80"),
    BudgetPlan.Scenario.AGGRESSIVE: Decimal("1.00"),
}

# Value-per-cost ranking: trust, purity, bioavailability, overall formulation quality.
WEIGHT_TRUST = Decimal("0.30")
WEIGHT_PURITY = Decimal("0.25")
WEIGHT_BIOAVAILABILITY = Decimal("0.25")
WEIGHT_QUALITY = Decimal("0.20")


def _dec(val) -> Decimal:
    return val if isinstance(val, Decimal) else Decimal(str(val))


def score_option(option: InterventionOption) -> Decimal:
    effectiveness = (
        _dec(option.trust_score) * WEIGHT_TRUST
        + _dec(option.purity_score) * WEIGHT_PURITY
        + _dec(option.bioavailability_score) * WEIGHT_BIOAVAILABILITY
        + _dec(option.quality_score) * WEIGHT_QUALITY
    )
    return effectiveness / max(_dec(option.monthly_cost), Decimal("1"))


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
                f"Ranked by value vs monthly cost using trust ({option.trust_score}), "
                f"purity ({option.purity_score}), bioavailability "
                f"({option.bioavailability_score}), formulation quality "
                f"({option.quality_score})."
            ),
        )
        remaining -= allocation

    return plan
