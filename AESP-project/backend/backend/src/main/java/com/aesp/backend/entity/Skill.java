package com.aesp.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    // Quan hệ ngược với mentor
    @ManyToMany(mappedBy = "skills")
    @JsonIgnore 
    private Set<User> mentors;

    // Constructor rỗng (Bắt buộc cho JPA)
    public Skill() {}

    // Constructor có tham số (Thay cho @AllArgsConstructor)
    public Skill(Long id, String name, Set<User> mentors) {
        this.id = id;
        this.name = name;
        this.mentors = mentors;
    }

    // --- GETTER & SETTER THỦ CÔNG ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Set<User> getMentors() { return mentors; }
    public void setMentors(Set<User> mentors) { this.mentors = mentors; }
}