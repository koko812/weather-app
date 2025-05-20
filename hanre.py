# legend_temp_labeled_big.py

from matplotlib import rcParams
import matplotlib.pyplot as plt
import numpy as np

rcParams['font.family'] = 'Hiragino Sans'

# 横長 + やや高さをもたせる
fig, ax = plt.subplots(figsize=(5, 1))  # ← 横:10inch 高さ:2inch に拡大
fig.subplots_adjust(bottom=0.4, top=0.8)  # 上下に余白確保

# 色とスケーリング
cmap = plt.get_cmap('coolwarm')
norm = plt.Normalize(vmin=-40, vmax=40)

cb = plt.colorbar(
    plt.cm.ScalarMappable(norm=norm, cmap=cmap),
    cax=ax,
    orientation='horizontal',
    ticks=[-40, -20, 0, 20, 40]
)

cb.set_label('気温 (°C)', fontsize=24)
cb.ax.tick_params(labelsize=24)

# 解像度を上げて保存（ファイルを置き換え）
plt.savefig('public/legend/temp.png', bbox_inches='tight', dpi=200)

