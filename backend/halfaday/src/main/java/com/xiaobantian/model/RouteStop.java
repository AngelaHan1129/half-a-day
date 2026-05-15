package com.xiaobantian.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "route_stops")
public class RouteStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    @JsonIgnore
    private Route route;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "place_id", nullable = false)
    private Place place;

    @Column(nullable = false)
    private Integer stopOrder;

    private Integer stayMinutes;

    @Column(columnDefinition = "TEXT")
    private String note;

    private String transportToNext;

    public RouteStop() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Route getRoute() { return route; }
    public void setRoute(Route route) { this.route = route; }

    public Place getPlace() { return place; }
    public void setPlace(Place place) { this.place = place; }

    public Integer getStopOrder() { return stopOrder; }
    public void setStopOrder(Integer stopOrder) { this.stopOrder = stopOrder; }

    public Integer getStayMinutes() { return stayMinutes; }
    public void setStayMinutes(Integer stayMinutes) { this.stayMinutes = stayMinutes; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getTransportToNext() { return transportToNext; }
    public void setTransportToNext(String transportToNext) { this.transportToNext = transportToNext; }
}