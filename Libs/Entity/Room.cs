using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Libs.Entity
{
    [Table("Room")]
    public class Room
    {
        [Key]
        public Guid id { get; set; }
        public string? Name { get; set; }
    }
}
