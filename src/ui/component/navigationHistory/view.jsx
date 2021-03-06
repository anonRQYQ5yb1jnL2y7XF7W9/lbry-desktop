// @flow
import * as React from 'react';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import ReactPaginate from 'react-paginate';
import NavigationHistoryItem from 'component/navigationHistoryItem';
import { withRouter } from 'react-router-dom';

type HistoryItem = {
  uri: string,
  lastViewed: number,
};

type Props = {
  historyItems: Array<HistoryItem>,
  page: number,
  pageCount: number,
  clearHistoryUri: string => void,
  params: { page: number },
  history: { push: string => void },
};

type State = {
  itemsSelected: {},
};

class UserHistoryPage extends React.PureComponent<Props, State> {
  constructor() {
    super();

    this.state = {
      itemsSelected: {},
    };

    (this: any).selectAll = this.selectAll.bind(this);
    (this: any).unselectAll = this.unselectAll.bind(this);
    (this: any).removeSelected = this.removeSelected.bind(this);
  }

  onSelect(uri: string) {
    const { itemsSelected } = this.state;

    const newItemsSelected = { ...itemsSelected };
    if (itemsSelected[uri]) {
      delete newItemsSelected[uri];
    } else {
      newItemsSelected[uri] = true;
    }

    this.setState({
      itemsSelected: { ...newItemsSelected },
    });
  }

  changePage(pageNumber: number) {
    const { history } = this.props;
    history.push(`?page=${pageNumber}`);
  }

  paginate(e: SyntheticKeyboardEvent<*>) {
    const pageFromInput = Number(e.currentTarget.value);
    if (
      pageFromInput &&
      e.keyCode === 13 &&
      !Number.isNaN(pageFromInput) &&
      pageFromInput > 0 &&
      pageFromInput <= this.props.pageCount
    ) {
      this.changePage(pageFromInput);
    }
  }

  selectAll() {
    const { historyItems } = this.props;
    const newSelectedState = {};
    historyItems.forEach(({ uri }) => (newSelectedState[uri] = true));
    this.setState({ itemsSelected: newSelectedState });
  }

  unselectAll() {
    this.setState({
      itemsSelected: {},
    });
  }

  removeSelected() {
    const { clearHistoryUri } = this.props;
    const { itemsSelected } = this.state;

    Object.keys(itemsSelected).forEach(uri => clearHistoryUri(uri));
    this.setState({
      itemsSelected: {},
    });
  }

  render() {
    const { historyItems = [], page, pageCount } = this.props;
    const { itemsSelected } = this.state;
    const allSelected = Object.keys(itemsSelected).length === history.length;
    const selectHandler = allSelected ? this.unselectAll : this.selectAll;

    return history.length ? (
      <React.Fragment>
        <div className="card__actions card__actions--between">
          {Object.keys(itemsSelected).length ? (
            <Button button="link" label={__('Delete')} onClick={this.removeSelected} />
          ) : (
            <span>
              {/* Using an empty span so spacing stays the same if the button isn't rendered */}
            </span>
          )}
          <Button
            button="link"
            label={allSelected ? __('Cancel') : __('Select All')}
            onClick={selectHandler}
          />
        </div>
        {!!historyItems.length && (
          <section className="card__content item-list">
            {historyItems.map(item => (
              <NavigationHistoryItem
                key={item.uri}
                uri={item.uri}
                lastViewed={item.lastViewed}
                selected={!!itemsSelected[item.uri]}
                onSelect={() => {
                  this.onSelect(item.uri);
                }}
              />
            ))}
          </section>
        )}
        {pageCount > 1 && (
          <Form>
            <fieldset-group class="fieldset-group--smushed fieldgroup--paginate">
              <fieldset-section>
                <ReactPaginate
                  pageCount={pageCount}
                  pageRangeDisplayed={2}
                  previousLabel="‹"
                  nextLabel="›"
                  activeClassName="pagination__item--selected"
                  pageClassName="pagination__item"
                  previousClassName="pagination__item pagination__item--previous"
                  nextClassName="pagination__item pagination__item--next"
                  breakClassName="pagination__item pagination__item--break"
                  marginPagesDisplayed={2}
                  onPageChange={e => this.changePage(e.selected)}
                  forcePage={page}
                  initialPage={page}
                  disableInitialCallback
                  containerClassName="pagination"
                />
              </fieldset-section>
              <FormField
                type="text"
                name="paginate-input"
                label={__('Go to page:')}
                className="paginate-channel"
                onKeyUp={e => this.paginate(e)}
              />
            </fieldset-group>
          </Form>
        )}
      </React.Fragment>
    ) : (
      <div className="page__empty">
        <section className="card card--section">
          <header className="card__header">
            <h2 className="card__title">
              {__(
                "You don't have anything saved in history yet, go check out some content on LBRY!"
              )}
            </h2>
          </header>

          <div className="card__content">
            <div className="card__actions card__actions--center">
              <Button button="primary" navigate="/" label={__('Explore new content')} />
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default withRouter(UserHistoryPage);
