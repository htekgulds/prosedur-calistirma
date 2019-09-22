package com.example.demo.prosedur;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
public class ProsedurService {
    private final ProsedurIslemRepo prosedurIslemRepo;

    public ProsedurService(ProsedurIslemRepo prosedurIslemRepo) {
        this.prosedurIslemRepo = prosedurIslemRepo;
    }

    @Async
    public CompletableFuture<String> calistir(ProsedurIstek prosedur) throws InterruptedException {
        log.info("Prosedür çalıştırılıyor: {}", prosedur.getAdi());
        Thread.sleep(10000);

        /* Hata varsa döndür */
        return CompletableFuture.completedFuture(null);
    }

    @Async
    public void islemKaydet(ProsedurIslem islem) {
        log.info("Prosedür işlemi kaydedildi. Başlama zamanı: {}", islem.getBaslama());
        prosedurIslemRepo.save(islem);
    }
}
