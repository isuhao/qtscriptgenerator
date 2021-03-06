/****************************************************************************
**
** Copyright (C) 2013 Digia Plc and/or its subsidiary(-ies).
** Contact: http://www.qt-project.org/legal
**
** This file is part of the Qt Script Generator project on Qt Labs.
**
** $QT_BEGIN_LICENSE:LGPL$
** Commercial License Usage
** Licensees holding valid commercial Qt licenses may use this file in
** accordance with the commercial license agreement provided with the
** Software or, alternatively, in accordance with the terms contained in
** a written agreement between you and Digia.  For licensing terms and
** conditions see http://qt.digia.com/licensing.  For further information
** use the contact form at http://qt.digia.com/contact-us.
**
** GNU Lesser General Public License Usage
** Alternatively, this file may be used under the terms of the GNU Lesser
** General Public License version 2.1 as published by the Free Software
** Foundation and appearing in the file LICENSE.LGPL included in the
** packaging of this file.  Please review the following information to
** ensure the GNU Lesser General Public License version 2.1 requirements
** will be met: http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html.
**
** In addition, as a special exception, Digia gives you certain additional
** rights.  These rights are described in the Digia Qt LGPL Exception
** version 1.1, included in the file LGPL_EXCEPTION.txt in this package.
**
** GNU General Public License Usage
** Alternatively, this file may be used under the terms of the GNU
** General Public License version 3.0 as published by the Free Software
** Foundation and appearing in the file LICENSE.GPL included in the
** packaging of this file.  Please review the following information to
** ensure the GNU General Public License version 3.0 requirements will be
** met: http://www.gnu.org/copyleft/gpl.html.
**
**
** $QT_END_LICENSE$
**
****************************************************************************/

function tr(s) { return s; }


function CircleWidget(parent)
{
    QWidget.call(this, parent);

    this.floatBased = false;
    this.antialiased = false;
    this.frameNo = 0;

    this.setBackgroundRole(QPalette.Base);
    this.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding);
}

CircleWidget.prototype = new QWidget();

CircleWidget.prototype.setFloatBased = function(floatBased)
{
    this.floatBased = floatBased;
    this.update();
}

CircleWidget.prototype.setAntialiased = function(antialiased)
{
    this.antialiased = antialiased;
    this.update();
}

CircleWidget.prototype.getMinimumSizeHint = function()
{
    return new QSize(50, 50);
}

CircleWidget.prototype.getSizeHint = function()
{
    return new QSize(180, 180);
}

CircleWidget.prototype.nextAnimationFrame = function()
{
    ++this.frameNo;
    this.update();
}

CircleWidget.prototype.paintEvent = function(/* event */)
{
    var painter = new QPainter();
    painter.begin(this);
    painter.setRenderHint(QPainter.Antialiasing, this.antialiased);
    painter.translate(this.width / 2, this.height / 2);

    for (var diameter = 0; diameter < 256; diameter += 9) {
        var delta = Math.abs((this.frameNo % 128) - diameter / 2);
        var alpha = 255 - (delta * delta) / 4 - diameter;
        if (alpha > 0) {
            painter.setPen(new QPen(new QColor(0, diameter / 2, 127, alpha), 3));

            if (this.floatBased) {
                painter.drawEllipse(new QRectF(-diameter / 2.0, -diameter / 2.0,
                                               diameter, diameter));
            } else {
                painter.drawEllipse(new QRect(-diameter / 2, -diameter / 2,
                                              diameter, diameter));
            }
        }
    }

    painter.end();
}


function Window(parent)
{
    QWidget.call(this, parent);

    var aliasedLabel = this.createLabel(tr("Aliased"));
    var antialiasedLabel = this.createLabel(tr("Antialiased"));
    var intLabel = this.createLabel(tr("Int"));
    var floatLabel = this.createLabel(tr("Float"));

    var layout = new QGridLayout();
    layout.addWidget(aliasedLabel, 0, 1);
    layout.addWidget(antialiasedLabel, 0, 2);
    layout.addWidget(intLabel, 1, 0);
    layout.addWidget(floatLabel, 2, 0);

    var timer = new QTimer(this);

    for (var i = 0; i < 2; ++i) {
        for (var j = 0; j < 2; ++j) {
            var cw = new CircleWidget();
            cw.setAntialiased(j != 0);
            cw.setFloatBased(i != 0);

            timer.timeout.connect(
                    cw, cw.nextAnimationFrame);

            layout.addWidget(cw, i + 1, j + 1);
        }
    }
    timer.start(100);
    this.setLayout(layout);

    this.windowTitle = tr("Concentric Circles");
}

Window.prototype = new QWidget();

Window.prototype.createLabel = function(text)
{
    var label = new QLabel(text);
    label.alignment = Qt.AlignCenter;
    label.margin = 2;
    label.setFrameStyle(QFrame.Box | QFrame.Sunken);
    return label;
}

var win = new Window();
win.show();
QCoreApplication.exec();
