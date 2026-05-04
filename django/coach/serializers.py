from rest_framework import serializers


class CoachRecommendSerializer(serializers.Serializer):
    plan_id = serializers.IntegerField(min_value=1)
    user_prompt = serializers.CharField(required=False, allow_blank=True, default="")
