package com.messageledger.repository;

import com.messageledger.entity.WhatsAppLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface WhatsAppLogRepository extends JpaRepository<WhatsAppLog, Long> {

    default List<WhatsAppLog> findAllOrderBySentAtDesc() {
        return findAll(Sort.by(Sort.Direction.DESC, "sentAt"));
    }
}
