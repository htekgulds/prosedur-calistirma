package com.example.demo.prosedur;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/prosedurler")
public class ProsedurController {
    private final ProsedurIstekRepo prosedurIstekRepo;
    private final ProsedurIslemRepo prosedurIslemRepo;
    private final ProsedurService prosedurService;

    public ProsedurController(ProsedurIstekRepo prosedurIstekRepo, ProsedurIslemRepo prosedurIslemRepo, ProsedurService prosedurService) {
        this.prosedurIstekRepo = prosedurIstekRepo;
        this.prosedurIslemRepo = prosedurIslemRepo;
        this.prosedurService = prosedurService;
    }

    @GetMapping
    public List<ProsedurIstek> tumProsedurler() {
        return prosedurIstekRepo.findAll();
    }

    @GetMapping("{id}/islemler")
    public List<ProsedurIslem> islemler(@PathVariable Long id) {
        ProsedurIstek prosedur = prosedurIstekRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prosedür bulunamadı: " + id));
        return prosedurIslemRepo.findByProsedur(prosedur);
    }

    @PostMapping("{id}/calistir")
    public ResponseEntity<?> calistir(@PathVariable Long id) throws InterruptedException {
        ProsedurIstek prosedur = prosedurIstekRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prosedür bulunamadı: " + id));

        ProsedurIslem islem = new ProsedurIslem();
        islem.setProsedur(prosedur);
        islem.setBaslama(LocalDateTime.now());
        prosedurService.islemKaydet(islem);
        prosedurService.calistir(prosedur)
                .thenAccept(hata -> {
                    islem.setHata(hata);
                    islem.setBitis(LocalDateTime.now());
                    prosedurService.islemKaydet(islem);
                    log.info("Prosedürün çalışması bitti. Bitiş zamanı: {}", islem.getBitis()
                    );
                });

        return ResponseEntity.ok().build();
    }
}
