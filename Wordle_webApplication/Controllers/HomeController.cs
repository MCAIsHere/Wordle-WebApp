using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Diagnostics;
using Wordle_webApplication.Data;
using Wordle_webApplication.Models;

namespace Wordle_webApplication.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ApplicationDbContext db;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context, UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _logger = logger;
            db = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<IActionResult> Index()
        {
            var user = await _userManager.GetUserAsync(User);
            ViewBag.Username = user?.DisplayName;
            if (user != null)
            {
                var list_of_words = db.Words_DB.Find(user.Id);
                if (list_of_words == null)
                {
                    // If the list_of_words is not found, create a new Words object
                    list_of_words = new Words(user.Id);

                    // Save the new Words object to the database
                    db.Words_DB.Add(list_of_words);
                    await db.SaveChangesAsync();
                }
                else
                {
                    if (user.LastActive.Date != DateTime.Now.Date)
                    {
                        Console.WriteLine("Clearing words for a new day.");
                        list_of_words.ClearWords();
                        user.LastActive = DateTime.Now;
                        await db.SaveChangesAsync();
                    }
                }
                ViewBag.Words = list_of_words.GetWords();
                ViewBag.Sizable = list_of_words.GetSize();
            }

            return View();
        }

        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Index", "Home"); // Redirects to the home page after logout
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddWord([FromBody] string word)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user != null)
            {
                var list_of_words = db.Words_DB.Find(user.Id);

                if (list_of_words.GetSize() < 6)
                {
                    list_of_words.AddWord(word);
                    await db.SaveChangesAsync();
                    Console.WriteLine($"Word '{word}' added for user {user.UserName}.");
                }
                else
                {
                    Console.WriteLine("Limit reached");
                }
            }
            return Ok();
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
