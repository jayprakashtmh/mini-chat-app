package com.chatapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.chatapp.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {

	List<Message> findByReceiverIsNull();
	
	@Query("""
		    SELECT m FROM Message m
		    WHERE (m.sender.username = :user1 AND m.receiver.username = :user2)
		       OR (m.sender.username = :user2 AND m.receiver.username = :user1)
		    ORDER BY m.timestamp ASC
		""")
	List<Message> findPrivateMessages(
	        @Param("user1") String user1,
	        @Param("user2") String user2);


}
