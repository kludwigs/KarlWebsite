SELECT Max(date_time), Min(date_time), SUM(price), DateDiff(Max(date_time), Min(date_time)) 
INTO end_date, start_date, total_sum, num_days
FROM entries
WHERE user_id = in_user_id