//
// Copyright (c) 2009-2011 Artyom Beilis (Tonkikh)
//
// Distributed under the Boost Software License, Version 1.0.
// https://www.boost.org/LICENSE_1_0.txt

#ifndef BOOST_LOCALE_TIME_ZONE_HPP_INCLUDED
#define BOOST_LOCALE_TIME_ZONE_HPP_INCLUDED

#include <boost/locale/config.hpp>
#include <string>

#ifdef BOOST_MSVC
#    pragma warning(push)
#    pragma warning(disable : 4275 4251 4231 4660)
#endif

namespace boost { namespace locale {
    /// \addtogroup date_time
    ///
    /// @{

    /// \brief namespace that holds functions for operating with global
    /// time zone
    namespace time_zone {
        /// Get global time zone identifier. If empty, system time zone is used
        BOOST_LOCALE_DECL std::string global();
        /// Set global time zone identifier returning previous one. If empty, system time zone is used
        BOOST_LOCALE_DECL std::string global(const std::string& new_tz);
    } // namespace time_zone

    /// @}

}} // namespace boost::locale

#ifdef BOOST_MSVC
#    pragma warning(pop)
#endif

#endif
