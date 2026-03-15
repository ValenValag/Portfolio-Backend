package com.valenvalag.portfoliobackend.models;

import lombok.Getter;
import lombok.Setter;

public class Repository {
    @Getter
    @Setter
    private String name, html_url, created_at, updated_at, description, language;
}
