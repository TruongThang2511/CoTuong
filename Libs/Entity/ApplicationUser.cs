using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Libs.Entity;

public class ApplicationUser : IdentityUser
{
    // Bạn có thể thêm các trường tùy chỉnh vào đây để mở rộng thông tin người dùng.
    // Ví dụ: Họ và tên, ngày sinh, địa chỉ, avatar, v.v.

    // Thêm các trường khác tùy theo yêu cầu của ứng dụng.

    // Nếu bạn muốn thêm quan hệ giữa người dùng và các bảng khác (ví dụ: Quan hệ Nhiều-Nhiều), bạn cũng có thể thêm các thuộc tính đại diện cho quan hệ ở đây.

    // Ví dụ:
    // public virtual ICollection<UserRole> UserRoles { get; set; }
    // public virtual ICollection<UserClaim> Claims { get; set; }
}