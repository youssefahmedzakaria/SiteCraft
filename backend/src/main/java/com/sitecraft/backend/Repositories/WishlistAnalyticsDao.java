package com.sitecraft.backend.Repositories;

import org.springframework.stereotype.Repository;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import java.util.List;
import java.time.LocalDate;

@Repository
public class WishlistAnalyticsDao {
    private final NamedParameterJdbcTemplate jdbc;

    public WishlistAnalyticsDao(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Returns a list of WishlistTrend(productName, saveCount) for each product
     * saved between startDate and endDate for the given store.
     */
    public List<WishlistTrend> findWishlistTrends(
        Long storeId,
        LocalDate startDate,
        LocalDate endDate
    ) {
        String sql = """
            SELECT p.name AS productName,
                   COUNT(*) AS saveCount
              FROM WishListProduct wp
              JOIN WishList w    ON wp.wishlist_id = w.id
              JOIN Customer c    ON c.wishlist_id = w.id
              JOIN Product p     ON wp.product_id = p.id
             WHERE c.store_id = :storeId
               AND wp.created_at BETWEEN :startDate AND :endDate
             GROUP BY p.name
             ORDER BY saveCount DESC
            """;

        var params = new MapSqlParameterSource()
            .addValue("storeId",  storeId)
            .addValue("startDate", startDate)
            .addValue("endDate",   endDate);

        return jdbc.query(
            sql,
            params,
            (rs, rowNum) -> new WishlistTrend(
                rs.getString("productName"),
                rs.getInt   ("saveCount")
            )
        );
    }

    /** Simple holder for product name + save count. */
    public static record WishlistTrend(String productName, int saveCount) {}
}
