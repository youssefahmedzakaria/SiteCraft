package com.sitecraft.backend.Models;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customizedtemplate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomizedTemplateSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "jsonb")
    private String value; // Use String to store JSONB

    private Integer index;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", referencedColumnName = "id", nullable = false)
    @JsonIgnore
    private Store store;



}

