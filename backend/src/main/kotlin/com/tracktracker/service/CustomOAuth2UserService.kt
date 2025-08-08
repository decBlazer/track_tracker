package com.tracktracker.service

import com.tracktracker.model.User
import com.tracktracker.repository.UserRepository
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest
import org.springframework.security.oauth2.core.OAuth2AuthenticationException
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.stereotype.Service

@Service
class CustomOAuth2UserService(
    private val userRepository: UserRepository
) : DefaultOAuth2UserService() {

    override fun loadUser(userRequest: OAuth2UserRequest): OAuth2User {
        val oauth2User = super.loadUser(userRequest)
        
        try {
            return processOAuth2User(userRequest, oauth2User)
        } catch (ex: Exception) {
            throw OAuth2AuthenticationException(ex.message)
        }
    }

    private fun processOAuth2User(userRequest: OAuth2UserRequest, oauth2User: OAuth2User): OAuth2User {
        val provider = userRequest.clientRegistration.registrationId
        val providerId = oauth2User.getAttribute<String>("id") ?: return oauth2User
        val email = oauth2User.getAttribute<String>("email")
        val name = oauth2User.getAttribute<String>("display_name") ?: oauth2User.getAttribute<String>("name")
        
        var user = userRepository.findBySpotifyId(providerId)
        
        if (user == null) {
            createNewUser(provider, providerId, email, name)
        } else {
            updateExistingUser(user, email, name)
        }
        
        return oauth2User
    }

    private fun createNewUser(provider: String, providerId: String, email: String?, name: String?) {
        val user = User(
            spotifyId = providerId,
            email = email ?: "$providerId@spotify.com",
            username = name ?: "User_$providerId",
            displayName = name ?: "User_$providerId"
        )
        userRepository.save(user)
    }

    private fun updateExistingUser(user: User, email: String?, name: String?) {
        val updatedUser = user.copy(
            email = email ?: user.email,
            username = name ?: user.username,
            displayName = name ?: user.displayName
        )
        userRepository.save(updatedUser)
    }
} 