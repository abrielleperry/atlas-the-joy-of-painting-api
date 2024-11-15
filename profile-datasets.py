import pandas as pd
from pandas_profiling import ProfileReport

# load datasets Colors-Used, Subject_Matter, and Episode_Dates
colors_used = pd.read_csv('/mnt/data/Colors-Used.csv')
subject_matter = pd.read_csv('/mnt/data/Subject-Matter.csv')
episode_dates = pd.read_csv('/mnt/data/Episode-Dates.csv')

# create profiling reports
profile_colors_used = ProfileReport(colors_used, title="Colors Dataset Profiling Report")
profile_subject_matter = ProfileReport(subject_matter, title="Subjects Dataset Profiling Report")
profile_episode_dates = ProfileReport(episode_dates, title="Episodes Dataset Profiling Report")

# save reports
profile_colors_used.to_file("colors_used_profiling_report.html")
profile_subject_matter.to_file("subject_matter_profiling_report.html")
profile_episode_dates.to_file("episode_dates_profiling_report.html")
