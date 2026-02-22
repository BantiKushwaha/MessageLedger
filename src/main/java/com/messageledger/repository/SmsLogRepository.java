package com.messageledger.repository;

import com.messageledger.entity.SmsLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface SmsLogRepository extends JpaRepository<SmsLog, Long> {

    default List<SmsLog> findAllOrderBySentAtDesc() {
        return findAll(Sort.by(Sort.Direction.DESC, "sentAt"));
    }
}
