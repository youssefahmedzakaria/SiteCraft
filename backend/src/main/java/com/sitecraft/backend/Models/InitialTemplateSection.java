package com.sitecraft.backend.Models;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "initialtemplatesection")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InitialTemplateSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer templateId;

    private String title;

    @Column(columnDefinition = "jsonb")
    private String value;

    private Integer index;

}
