//  Copyright (c) 2018 Robert Ramey
//
// Distributed under the Boost Software License, Version 1.0. (See
// accompanying file LICENSE_1_0.txt or copy at
// http://www.boost.org/LICENSE_1_0.txt)

#pragma once

#include "test_values.hpp"

constexpr const char *test_compare_automatic_result[
    boost::mp11::mp_size<test_values>::value
] = {
//      0       0       0       0
//      012345670123456701234567012345670
//      012345678901234567890123456789012
/* 0*/ "=<>>=<>>=<>>=<>>=<<<=<<<=<<<=<xx>",
/* 1*/ ">=>>><>>><>>><>>>=<<><<<><<<><xx>",
/* 2*/ "<<=<<<><<<><<<><<<<<<<<<<<<<<<xx<",
/* 3*/ "<<>=<<>=<<>=<<>=<<<<<<<<<<<<<<xx<",
/* 4*/ "=<>>=<>>=<>>=<>>=<<<=<<<=<<<=<xx>",
/* 5*/ ">>>>>=>>><>>><>>>>>>>=<<><<<><xx>",
/* 6*/ "<<<<<<=<<<><<<><<<<<<<<<<<<<<<xx<",
/* 7*/ "<<>=<<>=<<>=<<>=<<<<<<<<<<<<<<xx<",

/* 8*/ "=<>>=<>>=<>>=<>>=<<<=<<<=<<<=<xx>",
/* 9*/ ">>>>>>>>>=>>><>>>>>>>>>>>=<<><xx>",
/*10*/ "<<<<<<<<<<=<<<><<<<<<<<<<<<<<<xx<",
/*11*/ "<<>=<<>=<<>=<<>=<<<<<<<<<<<<<<xx<",
/*12*/ "=<>>=<>>=<>>=<>>=<<<=<<<=<<<=<xx>",
/*13*/ ">>>>>>>>>>>>>=>>>>>>>>>>>>>>>=xx>",
/*14*/ "<<<<<<<<<<<<<<=<<<<<<<<<<<<<<<xx<",
/*15*/ "<<>=<<>=<<>=<<>=<<<<<<<<<<<<<<xx<",

//      0       0       0       0
//      012345670123456701234567012345670
//      012345678901234567890123456789012
/*16*/ "=<>>=<>>=<>>=<>>=<<<=<<<=<<<=<<<>",
/*17*/ ">=>>><>>><>>><>>>=<<><<<><<<><<<>",
/*18*/ ">>>>><>>><>>><>>>>=<><<<><<<><<<>",
/*19*/ ">>>>><>>><>>><>>>>>=><<<><<<><<<>",
/*20*/ "=<>>=<>>=<>>=<>>=<<<=<<<=<<<=<<<>",
/*21*/ ">>>>>=>>><>>><>>>>>>>=<<><<<><<<>",
/*22*/ ">>>>>>>>><>>><>>>>>>>>=<><<<><<<>",
/*23*/ ">>>>>>>>><>>><>>>>>>>>>=><<<><<<>",

/*24*/ "=<>>=<>>=<>>=<>>=<<<=<<<=<<<=<<<>",
/*25*/ ">>>>>>>>>=>>><>>>>>>>>>>>=<<><<<>",
/*26*/ ">>>>>>>>>>>>><>>>>>>>>>>>>=<><<<>",
/*27*/ ">>>>>>>>>>>>><>>>>>>>>>>>>>=><<<>",
/*28*/ "=<>>=<>>=<>>=<>>=<<<=<<<=<<<=<<<>",
/*29*/ ">>>>>>>>>>>>>=>>>>>>>>>>>>>>>=<<>",
/*30*/ "xxxxxxxxxxxxxxxx>>>>>>>>>>>>>>=<x",
/*31*/ "xxxxxxxxxxxxxxxx>>>>>>>>>>>>>>>=x",
/*32*/ "<<>><<>><<>><<>><<<<<<<<<<<<<<xx="
};
