using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly TokenService tokenService;
        public AccountController(UserManager<AppUser> userManager,
         SignInManager<AppUser> signInManager,
         TokenService tokenService)
        {
            this.signInManager = signInManager;
            this.userManager = userManager;
            this.tokenService = tokenService;
        }

        [HttpPost("Login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await userManager.FindByEmailAsync(loginDTO.Email);

            if (user == null) { return Unauthorized(); }

            var result = await signInManager.CheckPasswordSignInAsync(user, loginDTO.Password, false);

            if (result.Succeeded)
            {
               return createUserObject(user);
            }

            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO RegisterDTO)
        {
            if (await userManager.Users.AnyAsync(x => x.Email == RegisterDTO.Email))
            {
                return BadRequest("Email Taken");
            }

            if (await userManager.Users.AnyAsync(x => x.UserName == RegisterDTO.Username))
            {
                return BadRequest("Username Taken");
            }

            var user = new AppUser
            {
                UserName = RegisterDTO.Username,
                Email = RegisterDTO.Email,
                DisplayName = RegisterDTO.DisplayName
            };

            var result = await userManager.CreateAsync(user, RegisterDTO.Password);

            if (result.Succeeded)
            {
                return createUserObject(user);
            }

            return BadRequest("Problem Registering User");
        }
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {
            var user = await userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

            return createUserObject(user);
        }

        private UserDTO createUserObject(AppUser user)
        {
            return new UserDTO
            {
                DisplayName = user.DisplayName,
                Image = null,
                Token = tokenService.CreateToken(user),
                Username = user.UserName
            };
        }
    }
}