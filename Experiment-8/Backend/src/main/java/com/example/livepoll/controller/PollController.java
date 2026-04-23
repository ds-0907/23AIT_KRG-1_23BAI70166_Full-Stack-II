package com.example.livepoll.controller;

import com.example.livepoll.dto.PollRequest;
import com.example.livepoll.dto.VoteRequest;
import com.example.livepoll.entity.Poll;
import com.example.livepoll.service.PollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/polls")
public class PollController {
    @Autowired
    private PollService pollService;

    @GetMapping
    public List<Poll> getPolls() {
        return pollService.getActivePolls();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Poll createPoll(@RequestBody PollRequest pollRequest) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Poll poll = Poll.builder()
                .question(pollRequest.getQuestion())
                .options(pollRequest.getOptions())
                .createdBy(username)
                .active(true)
                .build();
        return pollService.createPoll(poll);
    }

    @PostMapping("/{id}/vote")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> vote(@PathVariable Long id, @RequestBody VoteRequest voteRequest) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        pollService.vote(id, username, voteRequest.getOptionIndex());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/results")
    public Map<String, Long> getResults(@PathVariable Long id) {
        return pollService.getResults(id);
    }
}
