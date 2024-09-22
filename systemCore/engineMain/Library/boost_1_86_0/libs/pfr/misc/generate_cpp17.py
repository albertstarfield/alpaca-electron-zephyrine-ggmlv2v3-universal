#!/usr/bin/python

# Copyright (c) 2016-2024 Antony Polukhin
# Copyright (c) 2023 Denis Mikhailov
#
# Distributed under the Boost Software License, Version 1.0. (See accompanying
# file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)

############################################################################################################################

import sys
import string

# Skipping some letters that may produce keywords or are hard to read, or shadow template parameters
ascii_letters = string.ascii_letters.replace("o", "").replace("O", "").replace("i", "").replace("I", "").replace("T", "")
WORKAROUND_CAST_EXPRESSIONS_LIMIT_PER_LINE = 3

PROLOGUE = """// Copyright (c) 2016-2024 Antony Polukhin
// Copyright (c) 2023 Denis Mikhailov
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////// THIS HEADER IS AUTO GENERATED BY misc/generate_cpp17.py                                    ////////////////
//////////////// MODIFY AND RUN THE misc/generate_cpp17.py INSTEAD OF DIRECTLY MODIFYING THE GENERATED FILE ////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

#ifndef BOOST_PFR_DETAIL_CORE17_GENERATED_HPP
#define BOOST_PFR_DETAIL_CORE17_GENERATED_HPP
#pragma once

#include <boost/pfr/detail/config.hpp>
#if !BOOST_PFR_USE_CPP17
#   error C++17 is required for this header.
#endif

#include <boost/pfr/detail/sequence_tuple.hpp>
#include <boost/pfr/detail/size_t_.hpp>
#include <type_traits> // for std::conditional_t, std::is_reference

namespace boost { namespace pfr { namespace detail {

template <class... Args>
constexpr auto make_tuple_of_references(Args&&... args) noexcept {
  return sequence_tuple::tuple<Args&...>{ args... };
}

template<typename T, typename Arg>
constexpr decltype(auto) add_cv_like(Arg& arg) noexcept {
    if constexpr (std::is_const<T>::value && std::is_volatile<T>::value) {
        return const_cast<const volatile Arg&>(arg);
    }
    else if constexpr (std::is_const<T>::value) {
        return const_cast<const Arg&>(arg);
    }
    else if constexpr (std::is_volatile<T>::value) {
        return const_cast<volatile Arg&>(arg);
    }
    else {
        return const_cast<Arg&>(arg);
    }
}

// https://gcc.gnu.org/bugzilla/show_bug.cgi?id=78939
template<typename T, typename Sb, typename Arg>
constexpr decltype(auto) workaround_cast(Arg& arg) noexcept {
    using output_arg_t = std::conditional_t<!std::is_reference<Sb>(), decltype(detail::add_cv_like<T>(arg)), Sb>;
    return const_cast<output_arg_t>(arg);
}

template <class T>
constexpr auto tie_as_tuple(T& /*val*/, size_t_<0>) noexcept {
  return sequence_tuple::tuple<>{};
}

template <class T>
constexpr auto tie_as_tuple(T& val, size_t_<1>, std::enable_if_t<std::is_class< std::remove_cv_t<T> >::value>* = nullptr) noexcept {
  auto& [a] = const_cast<std::remove_cv_t<T>&>(val); // ====================> Boost.PFR: User-provided type is not a SimpleAggregate.
  return ::boost::pfr::detail::make_tuple_of_references(detail::workaround_cast<T, decltype(a)>(a));
}


template <class T>
constexpr auto tie_as_tuple(T& val, size_t_<1>, std::enable_if_t<!std::is_class< std::remove_cv_t<T> >::value>* = nullptr) noexcept {
  return ::boost::pfr::detail::make_tuple_of_references( val );
}

"""

############################################################################################################################
EPILOGUE = """
template <class T, std::size_t I>
constexpr void tie_as_tuple(T& /*val*/, size_t_<I>) noexcept {
  static_assert(sizeof(T) && false,
                "====================> Boost.PFR: Too many fields in a structure T. Regenerate include/boost/pfr/detail/core17_generated.hpp file for appropriate count of fields. For example: `python ./misc/generate_cpp17.py 300 > include/boost/pfr/detail/core17_generated.hpp`");
}

}}} // namespace boost::pfr::detail

#endif // BOOST_PFR_DETAIL_CORE17_GENERATED_HPP
"""

############################################################################################################################

def fold_workaround_cast(indexes, divider):
    WORKAROUND_CAST_TEMPLATE = """
detail::workaround_cast<T, decltype({arg})>({arg})
"""
    lines = []
    div = ''
    tokens = [x.strip() for x in indexes.split(',')]
    casts = [WORKAROUND_CAST_TEMPLATE.strip().format(arg=tok)
             for tok in tokens]
    for i in range(0, len(casts)):
        if i%WORKAROUND_CAST_EXPRESSIONS_LIMIT_PER_LINE==0:
            div = ''
            lines.append('')
        lines[-1] += div + casts[i]
        div = ','
    return divider.join(lines)

def calc_indexes_count(indexes):
    tokens = [x.strip() for x in indexes.split(',')]
    return len(tokens)

class EmptyLinePrinter:
    def print_once(self):
        if not self.printed:
            print("")
            self.printed = True
    printed = False

indexes = "    a"
print(PROLOGUE)
funcs_count = 100 if len(sys.argv) == 1 else int(sys.argv[1])
max_args_on_a_line = len(ascii_letters)
for i in range(1, funcs_count):
    if i % max_args_on_a_line == 0:
        indexes += ",\n    "
    else:
        indexes += ","

    if i >= max_args_on_a_line:
        indexes += ascii_letters[i // max_args_on_a_line - 1]
    indexes += ascii_letters[i % max_args_on_a_line]

    printed_casts = fold_workaround_cast(indexes.strip(), ",\n    ")
    indexes_count = calc_indexes_count(indexes.strip())
    empty_printer = EmptyLinePrinter()

    print("template <class T>")
    print("constexpr auto tie_as_tuple(T& val, size_t_<" + str(i + 1) + ">) noexcept {")
    if i < max_args_on_a_line:
        print("  auto& [" + indexes.strip() + "] = const_cast<std::remove_cv_t<T>&>(val); // ====================> Boost.PFR: User-provided type is not a SimpleAggregate.")
    else:
        print("  auto& [")
        print(indexes)
        print("  ] = const_cast<std::remove_cv_t<T>&>(val); // ====================> Boost.PFR: User-provided type is not a SimpleAggregate.")
        empty_printer.print_once()
 
    if indexes_count < WORKAROUND_CAST_EXPRESSIONS_LIMIT_PER_LINE:
        print("  return ::boost::pfr::detail::make_tuple_of_references(" + printed_casts + ");")
    else:
        empty_printer.print_once()
        print("  return ::boost::pfr::detail::make_tuple_of_references(")
        print("    " + printed_casts)
        print("  );")

    print("}\n")

print(EPILOGUE)
