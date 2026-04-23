package com.example.livepoll.service;

import com.example.livepoll.entity.Poll;
import com.example.livepoll.entity.Vote;
import com.example.livepoll.repository.PollRepository;
import com.example.livepoll.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PollService {
    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private VoteRepository voteRepository;

    public List<Poll> getActivePolls() {
        return pollRepository.findAllByActiveTrue();
    }

    @Transactional
    public Poll createPoll(Poll poll) {
        return pollRepository.save(poll);
    }

    @Transactional
    public void vote(Long pollId, String username, Integer optionIndex) {
        if (voteRepository.findByPollIdAndUsername(pollId, username).isPresent()) {
            throw new RuntimeException("User already voted on this poll");
        }
        Vote vote = Vote.builder()
                .pollId(pollId)
                .username(username)
                .selectedOption(optionIndex)
                .build();
        voteRepository.save(vote);
    }

    public Map<String, Long> getResults(Long pollId) {
        Poll poll = pollRepository.findById(pollId).orElseThrow();
        return poll.getOptions().stream().collect(Collectors.toMap(
                opt -> opt,
                opt -> voteRepository.countByPollIdAndSelectedOption(pollId, poll.getOptions().indexOf(opt))
        ));
    }
}
