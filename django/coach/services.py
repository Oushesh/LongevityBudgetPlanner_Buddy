from planner.models import BudgetPlan


def build_grounded_recommendation(plan: BudgetPlan, user_prompt: str):
    top_items = list(plan.line_items.all()[:3])
    actions = []
    for item in top_items:
        actions.append(
            {
                "action": f"Keep or start: {item.name}",
                "reason": item.rationale,
                "confidence": 0.75,
            }
        )

    if not actions:
        actions.append(
            {
                "action": "Add one low-cost preventive intervention first.",
                "reason": "No line items were present in this plan.",
                "confidence": 0.6,
            }
        )

    guidance = (
        "This guidance is informational and not medical advice. "
        "Use it with your clinician and personal financial context."
    )
    if user_prompt:
        guidance += f" Prompt considered: {user_prompt}"

    return {"plan_id": plan.id, "guidance": guidance, "actions": actions}
