package com.tracktracker.service

import com.tracktracker.model.User
import com.tracktracker.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.Optional

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {
    @Transactional
    fun createUser(email: String, password: String, username: String): User {
        if (userRepository.existsByEmail(email)) {
            throw IllegalArgumentException("Email already exists")
        }
        if (userRepository.existsByUsername(username)) {
            throw IllegalArgumentException("Username already exists")
        }

        val user = User(
            email = email,
            password = passwordEncoder.encode(password),
            username = username
        )
        return userRepository.save(user)
    }

    fun findByEmail(email: String): Optional<User> = userRepository.findByEmail(email)
    fun findByUsername(username: String): Optional<User> = userRepository.findByUsername(username)
    fun findById(id: Long): Optional<User> = userRepository.findById(id)
} 