package com.example.livepoll.repository;

import com.example.livepoll.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    List<Vote> findAllByPollId(Long pollId);
    Optional<Vote> findByPollIdAndUsername(Long pollId, String username);
    long countByPollIdAndSelectedOption(Long pollId, Integer selectedOption);
}
