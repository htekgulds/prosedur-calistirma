package com.example.demo.prosedur;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProsedurIslemRepo extends JpaRepository<ProsedurIslem, Long> {

    List<ProsedurIslem> findByProsedur(ProsedurIstek prosedur);
}
