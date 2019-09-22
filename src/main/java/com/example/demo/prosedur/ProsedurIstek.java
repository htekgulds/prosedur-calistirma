package com.example.demo.prosedur;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@Data
@NoArgsConstructor
public class ProsedurIstek {

    @Id
    @GeneratedValue
    private Long id;
    private String adi;

    public ProsedurIstek(String adi) {
        this.adi = adi;
    }
}
