package com.stockmaga.back.models;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class SuiviUtilisation {

    private Long end;

    private String nomAbonnement;

    private Long totalUsage;

    private Double amount;
}
