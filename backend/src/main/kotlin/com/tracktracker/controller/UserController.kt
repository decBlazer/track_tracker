package com.tracktracker.controller

import com.tracktracker.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/users")
class UserController(private val userService: UserService) {
    @PostMapping("/register")
    fun registerUser(
        @RequestParam email: String,
        @RequestParam password: String,
        @RequestParam username: String
    ): ResponseEntity<Any> {
        return try {
            val user = userService.createUser(email, password, username)
            ResponseEntity.ok(user)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }

    @GetMapping("/{id}")
    fun getUser(@PathVariable id: Long) = userService.findById(id)
        .map { ResponseEntity.ok(it) }
        .orElse(ResponseEntity.notFound().build())
} 