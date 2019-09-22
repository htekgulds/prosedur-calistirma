package com.example.demo.prosedur;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.stream.Stream;

@Slf4j
@Component
public class Bootstrap implements CommandLineRunner {
    private final ProsedurIstekRepo prosedurIstekRepo;

    public Bootstrap(ProsedurIstekRepo prosedurIstekRepo) {
        this.prosedurIstekRepo = prosedurIstekRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        Stream.of("Yeni Proseduür", "Başka Prosedür", "Daha Başka Prosedür")
                .map(ProsedurIstek::new)
                .map(prosedurIstekRepo::save)
                .forEach(prosedur -> log.info("Prosedür: {}", prosedur));
    }
}
