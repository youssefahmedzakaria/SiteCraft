package com.sitecraft.backend.Models;


import jakarta.persistence.*;

@Entity
@Table(name = "initialtemplatesection")
public class InitialTemplateSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer templateId;

    private String title;

    @Column(columnDefinition = "jsonb")
    private String value;

    private Integer index;

    public InitialTemplateSection(Integer id, Integer templateId, String title, String value, Integer index) {
        this.id = id;
        this.templateId = templateId;
        this.title = title;
        this.value = value;
        this.index = index;
    }

    public InitialTemplateSection() {
    }

    public Integer getIndex() {
        return index;
    }

    public void setIndex(Integer index) {
        this.index = index;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getTemplateId() {
        return templateId;
    }

    public void setTemplateId(Integer templateId) {
        this.templateId = templateId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
