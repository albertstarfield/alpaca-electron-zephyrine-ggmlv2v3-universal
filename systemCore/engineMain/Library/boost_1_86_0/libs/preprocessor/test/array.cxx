# /* **************************************************************************
#  *                                                                          *
#  *     (C) Copyright Paul Mensonides 2002.
#  *     Distributed under the Boost Software License, Version 1.0. (See
#  *     accompanying file LICENSE_1_0.txt or copy at
#  *     http://www.boost.org/LICENSE_1_0.txt)
#  *                                                                          *
#  ************************************************************************** */
#
# /* Revised by Edward Diener (2011,2013) */
#
# /* See http://www.boost.org for most recent version. */
#
# include <boost/preprocessor/config/limits.hpp>
# include <boost/preprocessor/array.hpp>
# include "test.h"
# include <boost/preprocessor/facilities/is_empty.hpp>
# include <boost/preprocessor/list/at.hpp>
# include <boost/preprocessor/list/size.hpp>
# include <boost/preprocessor/seq/elem.hpp>
# include <boost/preprocessor/seq/size.hpp>
# include <boost/preprocessor/tuple/elem.hpp>
# include <boost/preprocessor/tuple/size.hpp>
# include <boost/preprocessor/variadic/size.hpp>
# include <boost/preprocessor/variadic/elem.hpp>
# include <boost/preprocessor/variadic/has_opt.hpp>

# define ARRAY_EMPTY (0, ())
# define ARRAY_ONE (1, ())
# define ARRAY (3, (0, 1, 2))
# define ARRAY_LARGE (33, (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32))
# define ARRAY_VERY_LARGE (64, (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63))

#if BOOST_PP_LIMIT_TUPLE > 64

# define ARRAY_LARGE_128 \
    ( 104, \
    ( 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, \
    64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103 ) \
    )
    
# define ARRAY_VERY_LARGE_128 \
    ( 128, \
    ( 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, \
    64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127 ) \
    )
    
#endif

#if BOOST_PP_LIMIT_TUPLE > 128

# define ARRAY_LARGE_256 \
    ( 142, \
    ( 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, \
    64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, \
    128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141 ) \
    )

# define ARRAY_VERY_LARGE_256 \
    ( 256, \
    ( 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, \
    64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, \
    128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, \
    192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255 ) \
    )

# define ARRAY_VERY_LARGE_255 \
    ( 255, \
    ( 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, \
    64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, \
    128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, \
    192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254 ) \
    )

#endif

// element access

BEGIN BOOST_PP_IS_EMPTY(BOOST_PP_ARRAY_ELEM(0, ARRAY_ONE)) == 1 END
BEGIN BOOST_PP_ARRAY_ELEM(1, ARRAY) == 1 END
BEGIN BOOST_PP_ARRAY_ELEM(2, (5, (0, 1, 2, 3, 4))) == 2 END
BEGIN BOOST_PP_ARRAY_ELEM(28, ARRAY_LARGE) == 28 END
BEGIN BOOST_PP_ARRAY_ELEM(17, (33, (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32))) == 17 END
BEGIN BOOST_PP_ARRAY_ELEM(42, ARRAY_VERY_LARGE) == 42 END
BEGIN BOOST_PP_ARRAY_ELEM(62, (64, (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63))) == 62 END

// size

BEGIN BOOST_PP_ARRAY_SIZE(ARRAY) == 3 END
BEGIN BOOST_PP_ARRAY_SIZE((5, (0, 1, 2, 3, 4))) == 5 END
BEGIN BOOST_PP_ARRAY_SIZE(ARRAY_LARGE) == 33 END
BEGIN BOOST_PP_ARRAY_SIZE((33, (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32))) == 33 END
BEGIN BOOST_PP_ARRAY_SIZE(ARRAY_VERY_LARGE) == 64 END
BEGIN BOOST_PP_ARRAY_SIZE((64, (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63))) == 64 END
BEGIN BOOST_PP_ARRAY_SIZE(ARRAY_EMPTY) == 0 END
BEGIN BOOST_PP_ARRAY_SIZE(ARRAY_ONE) == 1 END

#if BOOST_PP_LIMIT_TUPLE > 64

BEGIN BOOST_PP_ARRAY_ELEM(73, ARRAY_LARGE_128) == 73 END
BEGIN BOOST_PP_ARRAY_ELEM(89, ARRAY_LARGE_128) == 89 END
BEGIN BOOST_PP_ARRAY_ELEM(101, ARRAY_LARGE_128) == 101 END
BEGIN BOOST_PP_ARRAY_ELEM(95, ARRAY_VERY_LARGE_128) == 95 END
BEGIN BOOST_PP_ARRAY_ELEM(110, ARRAY_VERY_LARGE_128) == 110 END
BEGIN BOOST_PP_ARRAY_ELEM(126, ARRAY_VERY_LARGE_128) == 126 END

#endif

#if BOOST_PP_LIMIT_TUPLE > 128

BEGIN BOOST_PP_ARRAY_ELEM(83, ARRAY_LARGE_256) == 83 END
BEGIN BOOST_PP_ARRAY_ELEM(131, ARRAY_LARGE_256) == 131 END
BEGIN BOOST_PP_ARRAY_ELEM(140, ARRAY_LARGE_256) == 140 END
BEGIN BOOST_PP_ARRAY_ELEM(174, ARRAY_VERY_LARGE_256) == 174 END
BEGIN BOOST_PP_ARRAY_ELEM(226, ARRAY_VERY_LARGE_256) == 226 END
BEGIN BOOST_PP_ARRAY_ELEM(253, ARRAY_VERY_LARGE_256) == 253 END

#endif

// enum

BEGIN BOOST_PP_VARIADIC_ELEM(2,BOOST_PP_ARRAY_ENUM(ARRAY)) == 2 END
BEGIN BOOST_PP_VARIADIC_ELEM(3,BOOST_PP_ARRAY_ENUM((5, (0, 1, 2, 3, 4)))) == 3 END
BEGIN BOOST_PP_VARIADIC_ELEM(31,BOOST_PP_ARRAY_ENUM(ARRAY_LARGE)) == 31 END
BEGIN BOOST_PP_VARIADIC_ELEM(13,BOOST_PP_ARRAY_ENUM((33, (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32)))) == 13 END
BEGIN BOOST_PP_VARIADIC_ELEM(39,BOOST_PP_ARRAY_ENUM(ARRAY_VERY_LARGE)) == 39 END
BEGIN BOOST_PP_VARIADIC_ELEM(24,BOOST_PP_ARRAY_ENUM((64, (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63)))) == 24 END
BEGIN BOOST_PP_VARIADIC_SIZE(BOOST_PP_ARRAY_ENUM((5, (0, 1, 2, 3, 4)))) == 5 END
BEGIN BOOST_PP_VARIADIC_SIZE(BOOST_PP_ARRAY_ENUM(ARRAY_LARGE)) == 33 END
BEGIN BOOST_PP_VARIADIC_SIZE(BOOST_PP_ARRAY_ENUM(ARRAY_VERY_LARGE)) == 64 END
BEGIN BOOST_PP_VARIADIC_SIZE(BOOST_PP_ARRAY_ENUM((64, (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63)))) == 64 END

# if BOOST_PP_VARIADIC_HAS_OPT()

BEGIN BOOST_PP_VARIADIC_SIZE(BOOST_PP_ARRAY_ENUM(ARRAY_ONE)) == 0 END

# else

BEGIN BOOST_PP_VARIADIC_SIZE(BOOST_PP_ARRAY_ENUM(ARRAY_ONE)) == 1 END

#endif

#if BOOST_PP_LIMIT_TUPLE > 64

BEGIN BOOST_PP_VARIADIC_SIZE(BOOST_PP_ARRAY_ENUM(ARRAY_LARGE_128)) == 104 END
BEGIN BOOST_PP_VARIADIC_SIZE(BOOST_PP_ARRAY_ENUM(ARRAY_VERY_LARGE_128)) == 128 END

#endif

#if BOOST_PP_LIMIT_TUPLE > 128

BEGIN BOOST_PP_VARIADIC_SIZE(BOOST_PP_ARRAY_ENUM(ARRAY_LARGE_256)) == 142 END
BEGIN BOOST_PP_VARIADIC_SIZE(BOOST_PP_ARRAY_ENUM(ARRAY_VERY_LARGE_256)) == 256 END

#endif

// to_list

BEGIN BOOST_PP_LIST_AT(BOOST_PP_ARRAY_TO_LIST(ARRAY), 1) == 1 END
BEGIN BOOST_PP_LIST_AT(BOOST_PP_ARRAY_TO_LIST((5, (0, 1, 2, 3, 4))), 4) == 4 END
BEGIN BOOST_PP_LIST_AT(BOOST_PP_ARRAY_TO_LIST((33, (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32))), 26) == 26 END
BEGIN BOOST_PP_LIST_AT(BOOST_PP_ARRAY_TO_LIST(ARRAY_VERY_LARGE), 60) == 60 END
BEGIN BOOST_PP_LIST_SIZE(BOOST_PP_ARRAY_TO_LIST(ARRAY_EMPTY)) == 0 END
BEGIN BOOST_PP_LIST_SIZE(BOOST_PP_ARRAY_TO_LIST(ARRAY_ONE)) == 1 END

#if BOOST_PP_LIMIT_TUPLE > 64

BEGIN BOOST_PP_LIST_AT(BOOST_PP_ARRAY_TO_LIST(ARRAY_LARGE_128), 88) == 88 END
BEGIN BOOST_PP_LIST_AT(BOOST_PP_ARRAY_TO_LIST(ARRAY_VERY_LARGE_128), 113) == 113 END

#endif

#if BOOST_PP_LIMIT_TUPLE > 128

BEGIN BOOST_PP_LIST_AT(BOOST_PP_ARRAY_TO_LIST(ARRAY_LARGE_256), 137) == 137 END
BEGIN BOOST_PP_LIST_AT(BOOST_PP_ARRAY_TO_LIST(ARRAY_VERY_LARGE_256), 235) == 235 END

#endif

// to_seq

BEGIN BOOST_PP_IS_EMPTY(BOOST_PP_SEQ_ELEM(0, BOOST_PP_ARRAY_TO_SEQ(ARRAY_ONE))) == 1 END
BEGIN BOOST_PP_SEQ_ELEM(0, BOOST_PP_ARRAY_TO_SEQ(ARRAY)) == 0 END
BEGIN BOOST_PP_SEQ_ELEM(3, BOOST_PP_ARRAY_TO_SEQ((5, (0, 1, 2, 3, 4)))) == 3 END
BEGIN BOOST_PP_SEQ_ELEM(17, BOOST_PP_ARRAY_TO_SEQ(ARRAY_LARGE)) == 17 END
BEGIN BOOST_PP_SEQ_ELEM(42, BOOST_PP_ARRAY_TO_SEQ((64, (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63)))) == 42 END

#if BOOST_PP_LIMIT_TUPLE > 64

BEGIN BOOST_PP_SEQ_ELEM(97,BOOST_PP_ARRAY_TO_SEQ(ARRAY_LARGE_128)) == 97 END
BEGIN BOOST_PP_SEQ_ELEM(123,BOOST_PP_ARRAY_TO_SEQ(ARRAY_VERY_LARGE_128)) == 123 END

#endif

#if BOOST_PP_LIMIT_TUPLE > 128

BEGIN BOOST_PP_SEQ_ELEM(53,BOOST_PP_ARRAY_TO_SEQ(ARRAY_LARGE_256)) == 53 END
BEGIN BOOST_PP_SEQ_ELEM(181,BOOST_PP_ARRAY_TO_SEQ(ARRAY_VERY_LARGE_256)) == 181 END

#endif

// to_tuple

BEGIN BOOST_PP_IS_EMPTY(BOOST_PP_TUPLE_ELEM(0, BOOST_PP_ARRAY_TO_TUPLE(ARRAY_ONE))) == 1 END
BEGIN BOOST_PP_TUPLE_ELEM(2, BOOST_PP_ARRAY_TO_TUPLE(ARRAY)) == 2 END
BEGIN BOOST_PP_TUPLE_ELEM(1, BOOST_PP_ARRAY_TO_TUPLE((5, (0, 1, 2, 3, 4)))) == 1 END
BEGIN BOOST_PP_TUPLE_ELEM(26, BOOST_PP_ARRAY_TO_TUPLE(ARRAY_LARGE)) == 26 END
BEGIN BOOST_PP_TUPLE_ELEM(37, BOOST_PP_ARRAY_TO_TUPLE((64, (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63)))) == 37 END

#if BOOST_PP_LIMIT_TUPLE > 64

BEGIN BOOST_PP_TUPLE_ELEM(97,BOOST_PP_ARRAY_TO_TUPLE(ARRAY_LARGE_128)) == 97 END
BEGIN BOOST_PP_TUPLE_ELEM(123,BOOST_PP_ARRAY_TO_TUPLE(ARRAY_VERY_LARGE_128)) == 123 END

#endif

#if BOOST_PP_LIMIT_TUPLE > 128

BEGIN BOOST_PP_TUPLE_ELEM(53,BOOST_PP_ARRAY_TO_TUPLE(ARRAY_LARGE_256)) == 53 END
BEGIN BOOST_PP_TUPLE_ELEM(181,BOOST_PP_ARRAY_TO_TUPLE(ARRAY_VERY_LARGE_256)) == 181 END

#endif

// insert

BEGIN BOOST_PP_ARRAY_ELEM(0, BOOST_PP_ARRAY_INSERT(ARRAY_ONE,0,63)) == 63 END
BEGIN BOOST_PP_ARRAY_ELEM(0, BOOST_PP_ARRAY_INSERT(ARRAY,2,40)) == 0 END
BEGIN BOOST_PP_ARRAY_ELEM(1, BOOST_PP_ARRAY_INSERT(ARRAY,1,40)) == 40 END
BEGIN BOOST_PP_ARRAY_ELEM(2, BOOST_PP_ARRAY_INSERT(ARRAY,1,40)) == 1 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_INSERT(ARRAY,1,40)) == 4 END

BEGIN BOOST_PP_ARRAY_ELEM(8, BOOST_PP_ARRAY_INSERT(ARRAY_LARGE,22,1000)) == 8 END
BEGIN BOOST_PP_ARRAY_ELEM(22, BOOST_PP_ARRAY_INSERT(ARRAY_LARGE,22,1000)) == 1000 END
BEGIN BOOST_PP_ARRAY_ELEM(26, BOOST_PP_ARRAY_INSERT(ARRAY_LARGE,22,1000)) == 25 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_INSERT(ARRAY_LARGE,22,1000)) == 34 END

BEGIN BOOST_PP_ARRAY_ELEM(0, BOOST_PP_ARRAY_INSERT(ARRAY_EMPTY,0,25)) == 25 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_INSERT(ARRAY_EMPTY,0,1000)) == 1 END

#if BOOST_PP_LIMIT_TUPLE > 64

BEGIN BOOST_PP_ARRAY_ELEM(69, BOOST_PP_ARRAY_INSERT(ARRAY_LARGE_128,76,1000)) == 69 END
BEGIN BOOST_PP_ARRAY_ELEM(101, BOOST_PP_ARRAY_INSERT(ARRAY_LARGE_128,101,1000)) == 1000 END
BEGIN BOOST_PP_ARRAY_ELEM(98, BOOST_PP_ARRAY_INSERT(ARRAY_LARGE_128,96,1000)) == 97 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_INSERT(ARRAY_LARGE_128,84,1000)) == 105 END

#endif

#if BOOST_PP_LIMIT_TUPLE > 128

BEGIN BOOST_PP_ARRAY_ELEM(73, BOOST_PP_ARRAY_INSERT(ARRAY_LARGE_256,134,1000)) == 73 END
BEGIN BOOST_PP_ARRAY_ELEM(141, BOOST_PP_ARRAY_INSERT(ARRAY_LARGE_256,141,1000)) == 1000 END
BEGIN BOOST_PP_ARRAY_ELEM(133, BOOST_PP_ARRAY_INSERT(ARRAY_LARGE_256,39,1000)) == 132 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_INSERT(ARRAY_LARGE_256,121,1000)) == 143 END
BEGIN BOOST_PP_ARRAY_ELEM(227,BOOST_PP_ARRAY_INSERT(ARRAY_VERY_LARGE_255,212,1000)) == 226 END
BEGIN BOOST_PP_ARRAY_ELEM(212,BOOST_PP_ARRAY_INSERT(ARRAY_VERY_LARGE_255,212,1000)) == 1000 END

#endif

// pop_back

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_POP_BACK(ARRAY)) == 2 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_POP_BACK(ARRAY_LARGE)) == 32 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_POP_BACK(ARRAY_VERY_LARGE)) == 63 END

#if BOOST_PP_LIMIT_TUPLE > 64

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_POP_BACK(ARRAY_LARGE_128)) == 103 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_POP_BACK(ARRAY_VERY_LARGE_128)) == 127 END

#endif

#if BOOST_PP_LIMIT_TUPLE > 128

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_POP_BACK(ARRAY_LARGE_256)) == 141 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_POP_BACK(ARRAY_VERY_LARGE_256)) == 255 END

#endif

// pop_front

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_POP_FRONT(ARRAY)) == 2 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_POP_FRONT(ARRAY_LARGE)) == 32 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_POP_FRONT(ARRAY_VERY_LARGE)) == 63 END

BEGIN BOOST_PP_ARRAY_ELEM(1, BOOST_PP_ARRAY_POP_FRONT(ARRAY)) == 2 END
BEGIN BOOST_PP_ARRAY_ELEM(31, BOOST_PP_ARRAY_POP_FRONT(ARRAY_LARGE)) == 32 END
BEGIN BOOST_PP_ARRAY_ELEM(55, BOOST_PP_ARRAY_POP_FRONT(ARRAY_VERY_LARGE)) == 56 END

#if BOOST_PP_LIMIT_TUPLE > 64

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_POP_FRONT(ARRAY_LARGE_128)) == 103 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_POP_FRONT(ARRAY_VERY_LARGE_128)) == 127 END
BEGIN BOOST_PP_ARRAY_ELEM(84, BOOST_PP_ARRAY_POP_FRONT(ARRAY_LARGE_128)) == 85 END
BEGIN BOOST_PP_ARRAY_ELEM(117, BOOST_PP_ARRAY_POP_FRONT(ARRAY_VERY_LARGE_128)) == 118 END

#endif

#if BOOST_PP_LIMIT_TUPLE > 128

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_POP_FRONT(ARRAY_LARGE_256)) == 141 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_POP_FRONT(ARRAY_VERY_LARGE_256)) == 255 END
BEGIN BOOST_PP_ARRAY_ELEM(129, BOOST_PP_ARRAY_POP_FRONT(ARRAY_LARGE_256)) == 130 END
BEGIN BOOST_PP_ARRAY_ELEM(248, BOOST_PP_ARRAY_POP_FRONT(ARRAY_VERY_LARGE_256)) == 249 END

#endif

// push_back

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_PUSH_BACK(ARRAY, 3)) == 4 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_PUSH_BACK(ARRAY_LARGE, 33)) == 34 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_PUSH_BACK(ARRAY_EMPTY, 10)) == 1 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_PUSH_BACK(ARRAY_ONE, 44)) == 2 END
BEGIN BOOST_PP_ARRAY_ELEM(0, BOOST_PP_ARRAY_PUSH_BACK(ARRAY, 3)) == 0 END
BEGIN BOOST_PP_ARRAY_ELEM(33, BOOST_PP_ARRAY_PUSH_BACK(ARRAY_LARGE, 33)) == 33 END
BEGIN BOOST_PP_ARRAY_ELEM(0, BOOST_PP_ARRAY_PUSH_BACK(ARRAY_EMPTY, 136)) == 136 END
BEGIN BOOST_PP_ARRAY_ELEM(1, BOOST_PP_ARRAY_PUSH_BACK(ARRAY_ONE, 245)) == 245 END

#if BOOST_PP_LIMIT_TUPLE > 64

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_PUSH_BACK(ARRAY_LARGE_128, 66)) == 105 END
BEGIN BOOST_PP_ARRAY_ELEM(104, BOOST_PP_ARRAY_PUSH_BACK(ARRAY_LARGE_128, 101)) == 101 END

#endif

#if BOOST_PP_LIMIT_TUPLE > 128

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_PUSH_BACK(ARRAY_LARGE_256, 192)) == 143 END
BEGIN BOOST_PP_ARRAY_ELEM(142, BOOST_PP_ARRAY_PUSH_BACK(ARRAY_LARGE_256, 77)) == 77 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_PUSH_BACK(ARRAY_VERY_LARGE_255, 255)) == 256 END

#endif

// push_front

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_PUSH_FRONT(ARRAY, 555)) == 4 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_PUSH_FRONT(ARRAY_LARGE, 666)) == 34 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_PUSH_FRONT(ARRAY_EMPTY, 10)) == 1 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_PUSH_FRONT(ARRAY_ONE, 131)) == 2 END
BEGIN BOOST_PP_ARRAY_ELEM(0, BOOST_PP_ARRAY_PUSH_FRONT(ARRAY, 555)) == 555 END
BEGIN BOOST_PP_ARRAY_ELEM(33, BOOST_PP_ARRAY_PUSH_FRONT(ARRAY_LARGE, 33)) == 32 END
BEGIN BOOST_PP_ARRAY_ELEM(0, BOOST_PP_ARRAY_PUSH_FRONT(ARRAY_EMPTY, 136)) == 136 END
BEGIN BOOST_PP_ARRAY_ELEM(0, BOOST_PP_ARRAY_PUSH_FRONT(ARRAY_ONE, 56)) == 56 END

#if BOOST_PP_LIMIT_TUPLE > 64

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_PUSH_FRONT(ARRAY_LARGE_128, 666)) == 105 END
BEGIN BOOST_PP_ARRAY_ELEM(103, BOOST_PP_ARRAY_PUSH_FRONT(ARRAY_LARGE_128, 29)) == 102 END

#endif

#if BOOST_PP_LIMIT_TUPLE > 128

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_PUSH_FRONT(ARRAY_LARGE_256, 333)) == 143 END
BEGIN BOOST_PP_ARRAY_ELEM(136, BOOST_PP_ARRAY_PUSH_FRONT(ARRAY_LARGE_256, 47)) == 135 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_PUSH_FRONT(ARRAY_VERY_LARGE_255, 4)) == 256 END

#endif

// remove

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_REMOVE(ARRAY_ONE, 0)) == 0 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_REMOVE(ARRAY, 1)) == 2 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_REMOVE(ARRAY_LARGE, 17)) == 32 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_REMOVE(ARRAY_VERY_LARGE, 27)) == 63 END
BEGIN BOOST_PP_ARRAY_ELEM(0, BOOST_PP_ARRAY_REMOVE(ARRAY, 2)) == 0 END
BEGIN BOOST_PP_ARRAY_ELEM(29, BOOST_PP_ARRAY_REMOVE(ARRAY_LARGE, 25)) == 30 END
BEGIN BOOST_PP_ARRAY_ELEM(62, BOOST_PP_ARRAY_REMOVE(ARRAY_VERY_LARGE, 48)) == 63 END

#if BOOST_PP_LIMIT_TUPLE > 64

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_REMOVE(ARRAY_LARGE_128, 100)) == 103 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_REMOVE(ARRAY_VERY_LARGE_128, 123)) == 127 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_REMOVE(ARRAY_VERY_LARGE_128, 0)) == 127 END
BEGIN BOOST_PP_ARRAY_ELEM(102, BOOST_PP_ARRAY_REMOVE(ARRAY_LARGE_128, 97)) == 103 END
BEGIN BOOST_PP_ARRAY_ELEM(76, BOOST_PP_ARRAY_REMOVE(ARRAY_LARGE_128, 0)) == 77 END
BEGIN BOOST_PP_ARRAY_ELEM(119, BOOST_PP_ARRAY_REMOVE(ARRAY_VERY_LARGE_128, 115)) == 120 END

#endif

#if BOOST_PP_LIMIT_TUPLE > 128

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_REMOVE(ARRAY_LARGE_256, 133)) == 141 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_REMOVE(ARRAY_LARGE_256, 0)) == 141 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_REMOVE(ARRAY_VERY_LARGE_256, 241)) == 255 END
BEGIN BOOST_PP_ARRAY_ELEM(140, BOOST_PP_ARRAY_REMOVE(ARRAY_LARGE_256, 138)) == 141 END
BEGIN BOOST_PP_ARRAY_ELEM(181, BOOST_PP_ARRAY_REMOVE(ARRAY_VERY_LARGE_256, 166)) == 182 END
BEGIN BOOST_PP_ARRAY_ELEM(236, BOOST_PP_ARRAY_REMOVE(ARRAY_VERY_LARGE_256, 0)) == 237 END

#endif

// replace

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_REPLACE(ARRAY_ONE, 0, 3)) == 1 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_REPLACE(ARRAY_VERY_LARGE, 27, 1000)) == 64 END
BEGIN BOOST_PP_ARRAY_ELEM(0, BOOST_PP_ARRAY_REPLACE(ARRAY_ONE, 0, 68)) == 68 END
BEGIN BOOST_PP_ARRAY_ELEM(0, BOOST_PP_ARRAY_REPLACE(ARRAY, 1, 44)) == 0 END
BEGIN BOOST_PP_ARRAY_ELEM(29, BOOST_PP_ARRAY_REPLACE(ARRAY_LARGE, 29, 999)) == 999 END
BEGIN BOOST_PP_ARRAY_ELEM(38, BOOST_PP_ARRAY_REPLACE(ARRAY_VERY_LARGE, 37, 1)) == 38 END
BEGIN BOOST_PP_ARRAY_ELEM(28, BOOST_PP_ARRAY_REPLACE(ARRAY_VERY_LARGE, 28, 1)) == 1 END

#if BOOST_PP_LIMIT_TUPLE > 64

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_REPLACE(ARRAY_VERY_LARGE_128, 93, 1000)) == 128 END
BEGIN BOOST_PP_ARRAY_ELEM(89, BOOST_PP_ARRAY_REPLACE(ARRAY_LARGE_128, 89, 111)) == 111 END
BEGIN BOOST_PP_ARRAY_ELEM(73, BOOST_PP_ARRAY_REPLACE(ARRAY_VERY_LARGE_128, 66, 1)) == 73 END
BEGIN BOOST_PP_ARRAY_ELEM(122, BOOST_PP_ARRAY_REPLACE(ARRAY_VERY_LARGE_128, 122, 1)) == 1 END
BEGIN BOOST_PP_ARRAY_ELEM(0, BOOST_PP_ARRAY_REPLACE(ARRAY_VERY_LARGE_128, 0, 128)) == 128 END
BEGIN BOOST_PP_ARRAY_ELEM(95, BOOST_PP_ARRAY_REPLACE(ARRAY_VERY_LARGE_128, 0, 128)) == 95 END

#endif

#if BOOST_PP_LIMIT_TUPLE > 128

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_REPLACE(ARRAY_VERY_LARGE_256, 217, 1000)) == 256 END
BEGIN BOOST_PP_ARRAY_ELEM(136, BOOST_PP_ARRAY_REPLACE(ARRAY_LARGE_256, 136, 999)) == 999 END
BEGIN BOOST_PP_ARRAY_ELEM(192, BOOST_PP_ARRAY_REPLACE(ARRAY_VERY_LARGE_256, 185, 1)) == 192 END
BEGIN BOOST_PP_ARRAY_ELEM(237, BOOST_PP_ARRAY_REPLACE(ARRAY_VERY_LARGE_256, 237, 1)) == 1 END
BEGIN BOOST_PP_ARRAY_ELEM(0, BOOST_PP_ARRAY_REPLACE(ARRAY_VERY_LARGE_256, 0, 256)) == 256 END
BEGIN BOOST_PP_ARRAY_ELEM(167, BOOST_PP_ARRAY_REPLACE(ARRAY_VERY_LARGE_256, 0, 256)) == 167 END

#endif

// reverse

BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_REVERSE(ARRAY_VERY_LARGE)) == 64 END

#if BOOST_PP_CONFIG_FLAGS() & BOOST_PP_CONFIG_STRICT()

BEGIN BOOST_PP_IS_EMPTY(BOOST_PP_ARRAY_ELEM(0, BOOST_PP_ARRAY_REVERSE(ARRAY_ONE))) == 1 END

#else

// BEGIN BOOST_PP_IS_EMPTY(BOOST_PP_ARRAY_ELEM(0, BOOST_PP_ARRAY_REVERSE(ARRAY_ONE))) == 1 END
BEGIN BOOST_PP_IS_EMPTY(BOOST_PP_ARRAY_ELEM(0, ARRAY_ONE)) == 1 END

#endif

BEGIN BOOST_PP_ARRAY_ELEM(0, BOOST_PP_ARRAY_REVERSE(ARRAY)) == 2 END
BEGIN BOOST_PP_ARRAY_ELEM(29, BOOST_PP_ARRAY_REVERSE(ARRAY_LARGE)) == 3 END
BEGIN BOOST_PP_ARRAY_ELEM(38, BOOST_PP_ARRAY_REVERSE(ARRAY_VERY_LARGE)) == 25 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_REVERSE(ARRAY_EMPTY)) == 0 END
BEGIN BOOST_PP_ARRAY_SIZE(BOOST_PP_ARRAY_REVERSE(ARRAY_ONE)) == 1 END

#if BOOST_PP_LIMIT_TUPLE > 64

BEGIN BOOST_PP_ARRAY_ELEM(83, BOOST_PP_ARRAY_REVERSE(ARRAY_LARGE_128)) == 20 END
BEGIN BOOST_PP_ARRAY_ELEM(119, BOOST_PP_ARRAY_REVERSE(ARRAY_VERY_LARGE_128)) == 8 END

#endif

#if BOOST_PP_LIMIT_TUPLE > 128

BEGIN BOOST_PP_ARRAY_ELEM(56, BOOST_PP_ARRAY_REVERSE(ARRAY_LARGE_256)) == 85 END
BEGIN BOOST_PP_ARRAY_ELEM(212, BOOST_PP_ARRAY_REVERSE(ARRAY_VERY_LARGE_256)) == 43 END

#endif
