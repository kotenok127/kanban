var DragManager = new function () {

    var dragObject = {};
    var self = this;
    document.onmousemove = onMouseMove;
    document.onmouseup = onMouseUp;
    document.onmousedown = onMouseDown;

    this.onDragEnd = function (dragObject, dropElem) {
    };
    this.onDragCancel = function (dragObject) {
    };

    function onMouseDown(e) {
        if (e.which !== 1) return;
        var elem = e.target.closest('.card');
        if (!elem) return;
        dragObject.elem = elem;
        dragObject.downX = e.pageX;
        dragObject.downY = e.pageY;

        return false;
    }

    function onMouseMove(e) {
        if (!dragObject.elem) return;
        if (!dragObject.avatar) {
            var moveX = e.pageX - dragObject.downX;
            var moveY = e.pageY - dragObject.downY;
            if (Math.abs(moveX) < 5 && Math.abs(moveY) < 5)
                return;
            dragObject.avatar = createAvatar();
            if (dragObject.avatar) {
                var coords = getCoords(dragObject.avatar);
                dragObject.shiftX = dragObject.downX - coords.left;
                dragObject.shiftY = dragObject.downY - coords.top;
                startDrag(e);
            } else {
                dragObject = {};
                return;
            }
        }
        dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
        dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';
        return false;
    }

    function onMouseUp(e) {
        if (dragObject.avatar) {
            finishDrag(e);
        }
        dragObject = {};
    }

    function finishDrag(e) {
        var dropElem = findDroppable(e);
        if (dropElem) {
            self.onDragEnd(dragObject, dropElem);
        } else {
            self.onDragCancel(dragObject);
        }
        var shadow = document.getElementsByClassName("shadow")[0];
        if (shadow !== null) shadow.parentNode.removeChild(shadow);
    }

    function createAvatar() {
        var avatar = dragObject.elem;
        var old = {
            parent: avatar.parentNode,
            nextSibling: avatar.nextSibling,
            position: avatar.position || '',
            left: avatar.left || '',
            top: avatar.top || '',
            zIndex: avatar.zIndex || ''
        };

        avatar.rollback = function () {
            old.parent.insertBefore(avatar, old.nextSibling);
            avatar.style.position = old.position;
            avatar.style.left = old.left;
            avatar.style.top = old.top;
            avatar.style.zIndex = old.zIndex;
        };

        return avatar;
    }

    function startDrag(e) {
        var shadow = document.createElement('div');
        shadow.className = "card shadow";
        shadow.style = dragObject.avatar.style;
        dragObject.elem.parentNode.insertBefore(shadow, dragObject.elem.nextSibling);
        var avatar = dragObject.avatar;
        document.body.appendChild(avatar);
        avatar.style.zIndex = 1000;
        avatar.style.position = 'absolute';
        avatar.style.width = "228px";
    }

    function findDroppable(event) {
        dragObject.avatar.hidden = true;
        var elem = document.elementFromPoint(event.clientX, event.clientY);
        dragObject.avatar.hidden = false;
        if (elem != null) {
            return elem.closest('.column');
        } else {
            return null;
        }
    }



};

const getCoords = elem => {
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };

};