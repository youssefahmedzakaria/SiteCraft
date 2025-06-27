package com.sitecraft.backend.DTOs;
import com.sitecraft.backend.Models.AboutUs;
import com.sitecraft.backend.Models.Policy;

import java.util.List;

public class StoreInfoDTO {
    private List<Policy> policies;
    private List<AboutUs> aboutUsList;

    public StoreInfoDTO(List<Policy> policies, List<AboutUs> aboutUsList) {
        this.policies = policies;
        this.aboutUsList = aboutUsList;
    }

    public List<Policy> getPolicies() {
        return policies;
    }

    public void setPolicies(List<Policy> policies) {
        this.policies = policies;
    }

    public List<AboutUs> getAboutUsList() {
        return aboutUsList;
    }

    public void setAboutUsList(List<AboutUs> aboutUsList) {
        this.aboutUsList = aboutUsList;
    }
}
