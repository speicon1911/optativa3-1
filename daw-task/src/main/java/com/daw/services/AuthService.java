package com.daw.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.daw.services.dto.LoginRequest;
import com.daw.services.dto.LoginResponse;
import com.daw.services.dto.RefreshDTO;
import com.daw.services.dto.RegisterRequest;
import com.daw.services.exceptions.PasswordException;
import com.daw.web.config.JwtUtils;

@Service
public class AuthService {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtUtils jwtUtil;

	@Autowired
	private UsuarioService usuarioService;

	public LoginResponse login(LoginRequest request) {
		Authentication authentication = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
		UserDetails userDetails = (UserDetails) authentication.getPrincipal();

		String accessToken = jwtUtil.generateAccessToken(userDetails);
		String refreshToken = jwtUtil.generateRefreshToken(userDetails);

		LoginResponse response = new LoginResponse();
		response.setAccess(accessToken);
		response.setRefresh(refreshToken);

		return response;
	}

	public LoginResponse registrar(RegisterRequest request) {
		if (!request.getPassword1().equals(request.getPassword2())) {
			throw new PasswordException("La password ");
		}

		this.usuarioService.create(request.getUsername(), request.getPassword1());
		Authentication authentication = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword1()));
		UserDetails userDetails = (UserDetails) authentication.getPrincipal();

		String accessToken = jwtUtil.generateAccessToken(userDetails);
		String refreshToken = jwtUtil.generateRefreshToken(userDetails);

		LoginResponse response = new LoginResponse();
		response.setAccess(accessToken);
		response.setRefresh(refreshToken);

		return response;
	}

	public LoginResponse refresh(RefreshDTO dto) {
		String accessToken = jwtUtil.generateAccessToken(dto.getRefresh());
		String refreshToken = jwtUtil.generateRefreshToken(dto.getRefresh());

		LoginResponse response = new LoginResponse();
		response.setAccess(accessToken);
		response.setRefresh(refreshToken);

		return response;
	}

}
