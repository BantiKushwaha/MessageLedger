package com.messageledger.repository;

import com.messageledger.entity.EmailLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface EmailLogRepository extends JpaRepository<EmailLog, Long> {

    default List<EmailLog> findAllOrderBySentAtDesc() {
        return findAll(Sort.by(Sort.Direction.DESC, "sentAt"));
    }
}
