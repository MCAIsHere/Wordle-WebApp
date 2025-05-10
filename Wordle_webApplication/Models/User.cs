using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json;

namespace Wordle_webApplication.Models
{
    public class User : IdentityUser
    {
        public string DisplayName { get; set; }
        public DateTime AccountCreation { get; set; } = DateTime.Now; // adica va fi generat automat la creare contului
        public DateTime LastActive { get; set; }
    }
}

