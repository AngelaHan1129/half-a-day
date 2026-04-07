package com.xiaobantian.dto;

import java.util.List;

public class RecommendRequest {

    private String destination;
    private Integer days;
    private Integer people;
    private String budget;
    private List<String> interests;
    private String specialNeeds;

    public RecommendRequest() {}

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public Integer getDays() { return days; }
    public void setDays(Integer days) { this.days = days; }

    public Integer getPeople() { return people; }
    public void setPeople(Integer people) { this.people = people; }

    public String getBudget() { return budget; }
    public void setBudget(String budget) { this.budget = budget; }

    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }

    public String getSpecialNeeds() { return specialNeeds; }
    public void setSpecialNeeds(String specialNeeds) { this.specialNeeds = specialNeeds; }
}