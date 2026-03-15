package com.valenvalag.portfoliobackend.controllers;

import com.valenvalag.portfoliobackend.models.Repository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

@RestController
public class GetRepos {

    @Value("${GIT_API_KEY}")
    private String API;

    @GetMapping("/repositories")
    public ResponseEntity<?> getRepositories() throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.github.com/users/ValenValag/repos"))
                .header("Authorization", "Bearer "+API)
                .header("Accept", "application/vnd.github+json")
                .header("X-GitHub-Api-Version", "2026-03-10")
                .GET()
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        String json = response.body();
        ObjectMapper mapper = new ObjectMapper();

        List<Repository> repos = mapper.readValue(
                json,
                mapper.getTypeFactory().constructCollectionType(List.class, Repository.class)
        );

        for (Repository repo : repos) {
            System.out.println(repo.getName());
        }

        return ResponseEntity.ok(repos);
    }

}
