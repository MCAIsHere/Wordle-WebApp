using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
namespace Wordle_webApplication.Models
{
    public class Words
    {
        [Key]
        public string UserId { get; set; }
        public string WordString { get; set; } 

        public Words() {}

        public Words(string id)
        {
            UserId = id;
            WordString = "";
        }

        public int GetSize() 
        {
            return string.IsNullOrWhiteSpace(WordString)
            ? 0
            : WordString.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
        }
        public List<string> GetWords()
        {
            return string.IsNullOrWhiteSpace(WordString)
                ? new List<string>()
                : WordString.Split(' ', StringSplitOptions.RemoveEmptyEntries).ToList();
        }
        public void AddWord(string word)
        {
            if (!string.IsNullOrWhiteSpace(WordString))
                WordString += " ";
            WordString += word;
        }

        public void ClearWords() { WordString = ""; }
    }
}
