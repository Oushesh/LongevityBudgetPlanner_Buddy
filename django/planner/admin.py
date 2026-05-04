from django.contrib import admin

from planner.models import (
    BudgetLineItem,
    BudgetPlan,
    BudgetProfile,
    InterventionOption,
    LongevityGoal,
    UserProfile,
)

admin.site.register(UserProfile)
admin.site.register(BudgetProfile)
admin.site.register(LongevityGoal)
admin.site.register(InterventionOption)
admin.site.register(BudgetPlan)
admin.site.register(BudgetLineItem)
